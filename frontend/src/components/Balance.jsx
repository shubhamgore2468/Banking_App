import React, { useEffect, useState } from "react";
import axios from "axios";

export function Balance({ balance }) {
  const [bal, setBal] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBal(response.data.balance);
      console.log(response.data);
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <div className="flex">
        <h2 className="text-lg font-bold">Your Balance</h2>
        <p className="text-lg ml-4 font-semibold">{bal}</p>
      </div>
      <div className="border-t-2 mt-4"></div>
    </div>
  );
}
