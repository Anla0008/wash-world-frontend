"use client";

import NearestWashCard from "@/components/dashboard/NearestWash";
import FAQ from "@/components/global/cards/FAQ";
import SubscriptionCard from "@/components/global/cards/SubscriptionCard";
import CustomerServiceCard from "@/components/global/cards/CustomerServiceCard";

const Dashboard = () => {
  const firstName = localStorage.getItem("user_first_name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>Hej {firstName}</h1>
      </div>

      <div>
        <NearestWashCard />
      </div>

      <div>
        <FAQ />
      </div>

      <div>
        <h2>Abonnementer</h2>
        <SubscriptionCard />
      </div>

      <div>
        <CustomerServiceCard />
      </div>
    </div>
  );
};

export default Dashboard;
