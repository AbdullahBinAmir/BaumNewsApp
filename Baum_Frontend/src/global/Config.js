const config = {
    screens: {
        SignIn: {
        path: 'SignIn/:params',
        parse: {
          name: params => `${params}`,
        },
      },
    },
  };
  
  const linking = {
    prefixes: ['Baum://app'],
    config,
  };
  
export default linking;