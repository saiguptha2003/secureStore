import React, { useState } from "react";
import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    EyeSlashIcon,
    ClipboardIcon,
    DocumentPlusIcon,
    SquaresPlusIcon
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Token Name", "Token ID", "Create Date", "Expiry Date"];

function TokensTable({ tokens }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);


    const [selectedToken, setSelectedToken] = useState(null);
    const [tokenVisible, setTokenVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const copyTokenToClipboard = () => {
        navigator.clipboard.writeText(selectedToken.token);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset the "Copied" state after 2 seconds
    };

    const truncatedToken = (t) => {
        return t.length > 10 ? t.slice(0, 10) + '...' : t;
    };

    const maskedToken = "*****"; // Masked version of the token

    const openModal = (token) => {
        setSelectedToken(token);
        setModalOpen(true);
    };
    const openCreateModal = () => {
        setCreateModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
        setSelectedToken(null);
        setTokenVisible(false);
    };
    const closeCreateModal = () => {
        setCreateModalOpen(false);

    }

    const toggleTokenVisibility = () => {
        setTokenVisible((prev) => !prev);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(parseFloat(timestamp) * 1000);
        return date.toLocaleString();
    };
    const [formData, setFormData] = useState({
        token_name: "",
        description: "",
        type_of_token: "",
        expire_date_time:"",
        nbytes:0,
    });
const handleInputChange = (e) => {
  const { name, value, type } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: type === "number" ? parseInt(value, 10) || 0 : value,
  }));
};

    const handleSubmit = async () => {
        const url = "http://localhost:5001/services/SecureStore/createSecureToken";
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFldGVzaCIsImV4cCI6MTczNTIyNjE4NywidXNlcl9pZCI6IjMwODVmMzZiZGEyNDQ5ODBhMjQyNzFlOGUyNDg5YzI4IiwiZW1haWwiOiJjaGFldGVzaEBnbWFpbC5jb20ifQ.hnBmUi_wbZwK9SueP6WEjMdBiS0NE6f7nbI7R6Y9zPk";

        try {
            console.log(formData.expire_date_time,"fsdfsdf")
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Authorization header with Bearer token
                },
                body: JSON.stringify(formData), // Sending formData as JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Response Data:", result);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };



    const fetchTokens = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/services/SecureStore/getAllSecureTokens"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch tokens");
            }
            const data = await response.json();
            console.log("Fetched Tokens:", data);
        } catch (error) {
            console.error("Error fetching tokens:", error);
        }
    };

    createModalOpen

    return (
        <>
            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                SecureToken List
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                Details
                            </Typography>
                        </div>
                        <div className="flex w-full shrink-0 gap-2 md:w-max">
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                />
                            </div>
                            <Button
                                className="flex items-center gap-3"
                                size="sm"
                                onClick={() => openCreateModal()}
                            >
                                <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Create Token
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token, index) => {
                                const isLast = index === tokens.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={token.id} onClick={() => openModal(token)}>
                                        <td className={classes}>{token.token_name}</td>
                                        <td className={classes}>{token.id}</td>
                                        <td className={classes}>
                                            {formatTimestamp(token.created_at)}
                                        </td>
                                        <td className={classes}>
                                            {new Date(token.expire_date_time).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Button variant="outlined" size="sm">
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="text" size="sm">
                            1
                        </Button>
                        <Button variant="text" size="sm">
                            2
                        </Button>
                        <Button variant="text" size="sm">
                            3
                        </Button>
                        <Button variant="text" size="sm">
                            ...
                        </Button>
                        <Button variant="text" size="sm">
                            8
                        </Button>
                        <Button variant="text" size="sm">
                            9
                        </Button>
                        <Button variant="text" size="sm">
                            10
                        </Button>
                    </div>
                    <Button variant="outlined" size="sm">
                        Next
                    </Button>
                </CardFooter>
            </Card>
            <Dialog open={createModalOpen} handler={closeCreateModal}>
                <DialogHeader className="flex justify-center items-center">
                    CREATE TOKEN
                </DialogHeader>
                <DialogBody
                    divider
                    style={{
                        maxHeight: "80vh", // Adjust the max height as per your needs
                        overflowY: "auto", // Enable scrolling when content overflows
                    }}
                >
                    {(
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <Typography variant="small" color="gray">
                                    Token Name:
                                </Typography>
                                <input
                                    name="token_name"
                                    type="text"
                                    placeholder="Enter new token name"
                                    className="border p-2 rounded text-black"
                                    value={formData.token_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Typography variant="small" color="gray">
                                    Description:
                                </Typography>
                                <input
                                    name="description"
                                    type="text"
                                    placeholder="Enter Description"
                                    className="border p-2 rounded text-black"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Typography variant="small" color="gray">
                                    Type of Token:
                                </Typography>
                                <select
                                    name="type_of_token"
                                    className="border p-2 rounded text-black"
                                    value={formData.type_of_token}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>
                                        Select Type of Token
                                    </option>
                                    <option value="hex">Hex</option>
                                    <option value="bytes">Bytes</option>
                                    <option value="urlsafe">URL Safe</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Typography variant="small" color="gray">
                                    Expire Date and Time:
                                </Typography>
                                <input
                                    name="expire_date_time"
                                    type="datetime-local"
                                    className="border p-2 rounded text-black"
                                    value={formData.expire_date_time}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Typography variant="small" color="gray">
                                    N Bytes:
                                </Typography>
                                <input
                                    name="nbytes"
                                    type="number"
                                    placeholder="Enter N Bytes"
                                    className="border p-2 rounded text-black"
                                    value={formData.nbytes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                    )}
                </DialogBody>
                <DialogFooter className="flex flex-col space-y-2">
                    <Button
                        variant="text"
                        color="red"
                        onClick={closeCreateModal}
                        className="w-full bg-red-100 hover:bg-red-200 active:bg-red-500 text-black"
                    >
                        Close
                    </Button>
                    <Button
                        variant="text"
                        color="green"
                        onClick={handleSubmit}
                        className="w-full bg-green-100 hover:bg-green-200 active:bg-green-500 text-black"
                    >
                        Submit
                    </Button>
                </DialogFooter>

            </Dialog>

            {/* Modal */}
            <Dialog open={modalOpen} handler={closeModal}>
                <DialogHeader className="flex justify-center items-center">
                    Token Details
                </DialogHeader>

                <DialogBody
                    divider
                    style={{
                        maxHeight: "80vh", // Adjust the max height as per your needs
                        overflowY: "auto", // Enable scrolling when content overflows
                    }}
                >
                    {selectedToken && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    Token Name:
                                </Typography>
                                <Typography>{selectedToken.token_name}</Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    Token ID:
                                </Typography>
                                <Typography>{selectedToken.id}</Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    Description:
                                </Typography>
                                <Typography>{selectedToken.description}</Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    Type:
                                </Typography>
                                <Typography>{selectedToken.type_of_token}</Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    NBytes:
                                </Typography>
                                <Typography>{selectedToken.nbytes}</Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    Create Date:
                                </Typography>
                                <Typography>{formatTimestamp(selectedToken.created_at)}</Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    Expiry Date:
                                </Typography>
                                <Typography>
                                    {new Date(selectedToken.expire_date_time).toLocaleString()}
                                </Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray">
                                    Token Value:
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <Typography>
                                        {tokenVisible ? truncatedToken(selectedToken.token) : maskedToken}
                                    </Typography>
                                    <Button
                                        variant="text"
                                        size="sm"
                                        onClick={toggleTokenVisibility}
                                    >
                                        {tokenVisible ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="text"
                                        size="sm"
                                        onClick={copyTokenToClipboard}
                                        disabled={isCopied}
                                    >
                                        {isCopied ? "Copied!" : <ClipboardIcon className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={closeModal}
                        className="w-full bg-red-100 hover:bg-red-200 active:bg-red-500 text-black"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>

        </>
    );
}

export default TokensTable;
