module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/styles/_variables.scss"
          @import "~@/styles/_mixins.scss"
          @import "~@/styles/_global.scss"
        `,
      },
      scss: {
        prependData: `
          @import "~@/styles/_variables.scss";
          @import "~@/styles/_mixins.scss";
          @import "~@/styles/_global.scss";
        `,
      },
    },
  },
};
