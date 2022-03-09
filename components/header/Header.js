import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { SunIcon, MoonIcon } from "@heroicons/react/outline";
const Header = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <SunIcon
          role="button"
          className=" navBtn"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <MoonIcon
          role="button"
          className=" text-blue-800 navBtn"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };
  return (
    <div className="flex justify-between items-center w-full h-12 md:h-16 lg:h-20 px-4 md:px-8 lg:px-12 border-b shadow-sm bg-blue-50 dark:bg-black">
      <div>
        <h1
          onClick={() => Router.push({ pathname: "/" })}
          className=" text-lg md:text-xl lg:text-3xl subpixel-antialiased font-semibold text-blue-900 dark:text-gray-200 cursor-pointer"
        >
          Burak Kaplan
        </h1>
      </div>
      <div></div>
      <div>{renderThemeChanger()}</div>
    </div>
  );
};

export default Header;
