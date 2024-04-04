import Link from "next/link";
import { Button } from "@/src/app/_components/shadcn/button";
import Image from "next/image";

import welcomePageImage from "./images/image2.webp";

//main home page user sees when going to base url
export default async function Home() {
  return (
    <>
      {/* Hero */}
      <div
        className="flex h-auto max-h-screen w-full flex-col items-end justify-between gap-20 rounded-3xl bg-cover bg-center p-7 text-white sm:flex-row"
        style={{
          backgroundImage: 'url("' + "/heroImage.png" + '")',
          aspectRatio: "16 / 9",
        }}
      >
        <div className="flex w-full flex-col justify-between text-nowrap text-center font-alumniSans font-gigabold xs:text-3xl sm:text-left sm:text-4xl md:text-5xl xl:text-8xl">
          <div>Unlock Prosperity</div>
          <div className="text-highlightYellow">Transform Your Business</div>
          <div>with BookBreeze</div>
        </div>
        <div className="flex w-1/2 max-w-96 flex-col items-end gap-7">
          <div className="sm:text-small text-right text-xs font-bold md:text-lg xl:text-xl">
            Unlock Your Financial Potential.<br></br> Try BookBreeze for free.
          </div>
          <Link href={"/dashboard"}>
            <Button variant="hightlighted" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Left Image/Right Text */}
      <div className="mt-14 flex flex-col items-center justify-center gap-14 text-center md:flex-row md:text-left">
        <div className="w-full md:w-1/2">
          <Image
            width={2481}
            height={1424}
            alt=""
            className="rounded-3xl border-2 border-gray-800"
            src={welcomePageImage}
          ></Image>
        </div>
        <div className="flex w-full flex-col gap-5 md:w-1/2">
          <div className="font-alumniSans text-5xl font-gigabold">We do accounting right.</div>
          <div className="text-sm text-subtitleText">
            We stand out for our seamless integration of advanced features designed to streamline your financial processes. With
            intuitive interfaces and robust functionalities, we offer unparalleled ease of use and efficiency, empowering you to
            manage your finances with confidence. From automated bookkeeping to insightful reporting, our app provides the tools
            you need to optimize your financial management, ensuring accuracy, transparency, and ultimately, fostering your
            business growth.
          </div>
        </div>
      </div>

      {/* Info Columns */}
      <div className="mt-14 flex flex-wrap justify-evenly gap-6">
        <InfoColumn
          title="Efficiency"
          text="BookBreeze excels in efficiency, automating tedious tasks and optimizing workflows to save you time and effort."
          icon="icon-[material-symbols--face-4]"
        ></InfoColumn>
        <InfoColumn
          title="Accuracy"
          text="Accuracy is at the core of BookBreeze's functionality, ensuring precise calculations and reliable data management for confident decision-making."
          icon="icon-[majesticons--creditcard]"
        ></InfoColumn>
        <InfoColumn
          title="Insight"
          text="Gain valuable insights into your financial performance with BookBreeze, which offers comprehensive reporting and analytics tools to help you make informed decisions."
          icon="icon-[ri--shirt-fill]"
        ></InfoColumn>
        <InfoColumn
          title="Integration"
          text="Seamlessly integrate your financial data across platforms and systems with BookBreeze, facilitating smooth collaboration and eliminating data silos for enhanced productivity."
          icon="icon-[ic--round-local-shipping]"
        ></InfoColumn>
      </div>

      {/* Wide Image */}
      <div
        className={`mt-14 flex min-h-44 items-center justify-center rounded-3xl bg-cover text-center font-alumniSans text-4xl font-gigabold tracking-wider text-white md:text-7xl`}
        style={{
          backgroundImage: 'url("' + "/imageWide.jpg" + '")',
        }}
      >
        Unlock Your Financial Potential
      </div>
    </>
  );
}

function InfoColumn(props: { title: string; text: string; icon: string }) {
  const { title, text, icon } = props;

  return (
    <div style={{ flexBasis: "23%" }} className="flex w-full min-w-52 flex-col">
      <div className="flex w-fit items-center justify-center rounded-full bg-black p-2">
        <span className={`${icon} h-6 w-6 text-white`}></span>
      </div>
      <div className={"text-medium mb-5 mt-6 font-dmSans font-bold"}>{title}</div>
      <div className="text-sm text-subtitleText">{text}</div>
    </div>
  );
}
