import StakeholderDashboard from "./views/stakeholder/Dashboard";
import Icons from "./views/Icons";
import Notifications from "./views/Notifications";
import UserProfile from "./views/UserProfile";
import TableList from "./views/TableList";
import Typography from "./views/Typography";


var routes =[
    {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: StakeholderDashboard,
    layout: "/stakeholder"
    },
    {
    path: "/icons",
    name: "Icons",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/subscriber"
  },
  {
    path: "/map",
    name: "Map",
    icon: "tim-icons icon-pin",
    component: Map,
    layout: "/subscriber"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/subscriber"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/subscriber"
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "tim-icons icon-puzzle-10",
    component: TableList,
    layout: "/subscriber"
  },
    {
        path: "/typography",
        name: "Typography",
        // icon: "tim-icons icon-align-center",
        component: Typography,
        layout: "/subscriber"
    }
];



export default routes;
