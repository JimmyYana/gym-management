import Image from "next/image";

export function Brand({ large = false }: { large?: boolean }) {
  const size = large ? 76 : 36;
  return <Image className="brand" src="/gym-logo.png" alt="Logotipo del gimnasio" width={size} height={size} unoptimized />;
}
