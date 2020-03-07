module.exports = {
    plugins: [
        [
            "component",
            {
                libraryName: "element-ui",
                styleLibraryName: "theme-chalk"
            }
        ]
    ],
    presets: [
        [
            "@vue/cli-plugin-babel/preset",
            {
                useBuiltIns: false
            }
        ]
    ]
};