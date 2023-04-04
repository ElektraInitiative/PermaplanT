import resolveConfig from 'tailwindcss/resolveConfig';
// TODO: figure out import
// import tailwindConfig from "./tailwind.config";

const tailwindConfig = {};

const config = resolveConfig(tailwindConfig);
const theme = config.theme;
export default theme;
