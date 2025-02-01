import React from "react";
import DashBoardSection2 from "../DashBoardSection2";
import DashBoard3Chart from "../DashBoard3Chart";

const DashBoard = () => {
  return (
    <div className="bg-[#d3d3d3]">
        {/* <DashBoard1Top /> */}
      <div className=" w-full">
        <DashBoardSection2 />
      </div>
      <DashBoard3Chart />

    </div>
  );
};

export default DashBoard;
