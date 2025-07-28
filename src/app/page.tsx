import LandingCard from "./components/card/LandingCard";
export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen font-bold text-white bg-black items-center ">
      <div className="px-4 pt-4 text-2xl sm:text-5xl text-blue-400 font-black ">
      DEVTOOLS.SOFTWARE
      </div>
      <div className="text-sm sm:text-xl text-semibold pt-2">
        Your One-Stop Free Toolkit for Modern Developers!
      </div>
      <div className="text-xs sm:text-sm pt-2">
        Our list of tools for free...
      </div>
      <ul className="text-semibold">
        <li>
          <a href="/qr">
          <LandingCard>
          Qr generator
          </LandingCard>
          </a>
        </li>
        <li>
          <a href="/json_validator">
          <LandingCard>
          JSON validator
          </LandingCard>
          </a>
        </li>
      </ul>
    </div>
  );
}
