import Image from 'next/image';

export const AppLogo: React.FC = () => {
  return (
    <Image src="/applogo.png" alt="App Logo" width={100} height={100} />
  );
};