"use client";

import NearestWashCard from "@/components/dashboard/NearestWash";
import FAQ from "@/components/global/cards/FAQ";
import CustomerServiceCard from "@/components/global/cards/CustomerServiceCard";
import SubscriptionCard from "@/components/global/cards/SubscriptionCard";
import { washData } from "@/mockupData/washData";

const Dashboard = () => {
  const firstName = localStorage.getItem("user_first_name");

  return (
    <div className="flex flex-col gap-6">
      <h1>Hej {firstName}</h1>

      <NearestWashCard />

      <FAQ />

      <div>
        <h2>Abonnementer</h2>
        {/* <SubscriptionCard /> */}
      </div>

      <CustomerServiceCard />
    </div>
  );
};

export default Dashboard;
