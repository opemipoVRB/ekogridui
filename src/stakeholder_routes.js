import StakeholderDashboard from "./views/stakeholder/Dashboard";
import UserProfile from "./views/UserProfile";
import Map from "./views/Map";
import BillingManagement from "./views/stakeholder/BillingManagement";
import DeviceManagement from "./views/stakeholder/DeviceManagement";
import Messages from "./views/stakeholder/Messages";
import ChatbotManagement from "./views/stakeholder/ChatbotManagement";


var routes =[
    {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: StakeholderDashboard,
    layout: "/stakeholder"
    },

    {
    path: "/billing-management",
    name: "Billing Management",
    icon: "tim-icons icon-coins",
    component: BillingManagement,
    layout: "/stakeholder"
  },

    {
    path: "/device-management",
    name: "Device Management",
    icon: "tim-icons icon-wifi",
    component: DeviceManagement,
    layout: "/stakeholder"
  },
  {
    path: "/map",
    name: "Map",
    icon: "tim-icons icon-map-big",
    component: Map,
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
    path: "/messages",
    name: "Messages",
    icon: "tim-icons icon-email-85",
    component: Messages,
    layout: "/stakeholder"
  },
    {
        path: "/chatbot-manager",
        name: "Manage Chatbot",
        icon: "tim-icons icon-components",
        component: ChatbotManagement,
        layout: "/subscriber"
    }
];


export default routes;

