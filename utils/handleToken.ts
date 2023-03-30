

const handleToken = (token: any) => {
  
  console.log(token);
  return {
    authorization: `Bearer${token}`,
  };
};

export default handleToken;