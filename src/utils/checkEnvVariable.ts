import dotenv from "dotenv";
dotenv.config();
const checkEnvVariable = (variable: string) => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Environment variable ${variable} is not set`);
  }
  return value;
};

export default checkEnvVariable;
