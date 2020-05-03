import StakeholderDashboard from "./views/stakeholder/Dashboard";
import Icons from "./views/Icons";
import Notifications from "./views/Notifications";
import UserProfile from "./views/UserProfile";
import TableList from "./views/TableList";
import Typography from "./views/Typography";
import Map from "./views/Map";


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
    layout: "/stakeholder"
  },
  {
    path: "/map",
    name: "Map",
    icon: "tim-icons icon-pin",
    component: Map,
    layout: "/stakeholder"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/stakeholder"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/stakeholder"
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "tim-icons icon-puzzle-10",
    component: TableList,
    layout: "/stakeholder"
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

