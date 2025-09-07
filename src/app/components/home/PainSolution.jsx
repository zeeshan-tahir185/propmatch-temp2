import React from "react";

const PainSolution = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-[50px] max-w-6xl mx-auto mt-[50px]">
      <div className="flex flex-col gap-[30px]">
        <h3 className="text-lg md:!text-3xl font-semibold">
          Why Agents Lose Listings: Chasing the Wrong Homeowners
        </h3>
        <p>
          80% of prospecting calls go nowhere—wasting time and costing you
          thousands in lost commissions. Traditional CRMs and marketing tools
          just add clutter.
        </p>
        <p>
          PropMatch cuts through the noise: it pinpoints homeowners ready to
          sell, ranks them by deal potential, and hands you tailored messages to
          close faster.
        </p>
      </div>
      <img src="/images/home/pain.png" alt="" className="w-full md:w-[45%] rounded-[20px]" />
    </div>
  );
};

export default PainSolution;
