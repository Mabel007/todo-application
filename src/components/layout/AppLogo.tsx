import logo from "@/assets/logos/logo.svg";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return <img src={logo} alt="Todo Application" className={className} />;
}
