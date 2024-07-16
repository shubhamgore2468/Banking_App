import React from "react";
import axios from "axios";
import { useState } from "react";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { useSearchParams, useNavigate } from "react-router-dom";

const Send = () => {
  const [money, setMoney] = useState(0);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center bg-gray-400 h-screen">
        <div className="my-20 p-20 content-center h-3/4 flex flex-col justify-center bg-white">
          <Heading label={"Send Money"} />
          <div className="flex iterms-center space-x-4 mt-4 ">
            <div className="text-semibold rounded-full bg-blue-600 h-8 w-8 text-center">
              {name[0]}
            </div>
            <div className="text-semibold">{name}</div>
          </div>
          <InputBox
            onChange={(e) => {
              setMoney(e.target.value);
            }}
            label={"Amount (in Rs)"}
            placeholder={"Enter amount"}
          />
          <Button
            onClick={async () => {
              const response = await axios.post(
                "http://localhost:3000/api/v1/account/transfer",
                { to: id, amount: money },
                {
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                }
              );
              navigate("/dashboard");
            }}
            label={"Initialte Transfer"}
          />
        </div>
      </div>
    </>
  );
};

export default Send;
