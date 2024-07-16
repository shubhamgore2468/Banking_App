import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export function AppBar({ title, user }) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("http://localhost:3000/api/v1/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setMe(response.data);
      console.log(response.data);
    };
    fetchUser();
  }, []);

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">PayTM App</div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">
          Hello, {me ? me.firstName || "Loading..." : "Loading..."}
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {me ? me.firstName[0] || "Loading..." : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
}
