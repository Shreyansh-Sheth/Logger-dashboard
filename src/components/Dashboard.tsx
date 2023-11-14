import {
  FileClock,
  HomeIcon,
  KeySquare,
  Settings2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { SwitchIcon } from "@radix-ui/react-icons";

const SidebarContent = [
  {
    href: "",
    label: "Home",
    icon: <HomeIcon className="ß my-auto h-4 w-4" />,
  },
  {
    href: "logs",
    label: "Logs",
    icon: <FileClock className="ß my-auto h-4 w-4" />,
  },
  {
    href: "errors",
    label: "Errors",
    icon: <ShieldAlert className="ß my-auto h-4 w-4" />,
  },
  {
    href: "key",
    label: "Keys",
    icon: <KeySquare className="ß my-auto h-4 w-4" />,
  },
];
export default function SidebarLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { query } = useRouter();

  return (
    <div className="relative grid  grid-cols-8">
      <div className=" col-span-1 h-screen border p-2 pb-16">
        <div className="flex h-full justify-between">
          <div className="flex w-full flex-col gap-2 px-5">
            <p className="mb-5 text-2xl font-bold">Loggerr</p>
            {SidebarContent.map((e) => (
              <Button
                variant={"ghost"}
                accessKey=""
                key={e.href}
                asChild
                className="w-full justify-start"
              >
                <Link
                  href={"/project/" + query?.id?.toString() + "/" + e.href}
                  className="flex justify-start gap-2 "
                >
                  {e.icon}
                  {e.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex">
          <Button className="w-full" size={"sm"} asChild>
            <Link href="/projects" className="flex gap-4">
              <SwitchIcon />
              Switch Project
            </Link>
          </Button>
        </div>
      </div>
      <div className="col-span-7 border p-5">
        <p className="text-2xl ">{title}</p>
        {children}
      </div>
    </div>
  );
}
