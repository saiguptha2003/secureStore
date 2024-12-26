const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to your source files
    "./public/index.html", // Include your HTML file if needed
  ],
  theme: {
    extend: {
      // Add any custom theme extensions here
    },
  },
  plugins: [
    // Add any TailwindCSS plugins you might need
  ],
});
