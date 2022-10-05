module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["import", { libraryName: "@ant-design/react-native" }], // 与 Web 平台的区别是不需要设置 style
      [
        "module-resolver",
        {
          alias: {
            "@Assets": "./src/assets",
            "@Components": "./src/components",
            "@Views": "./src/views",
            "@Utils": "./src/utils",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
    ],
  };
};
