import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

const Dashboard = () => {
  return (
    <div>
      <div>
        <AppBar />
        <div className="m-8">
          <Balance balance={"$5000"} />
          <Users />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
