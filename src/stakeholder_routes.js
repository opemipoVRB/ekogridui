import StakeholderDashboard from "./views/stakeholder/Dashboard";
import UserProfile from "./views/UserProfile";
import Map from "./views/Map";
import BillingManagement from "./views/stakeholder/BillingManagement";
import DeviceManagement from "./views/stakeholder/DeviceManagement";
import Messages from "./views/stakeholder/Messages";
import ChatbotManagement from "./views/stakeholder/ChatbotManagement";
import Subscribers from "./views/stakeholder/Subscribers";
import DiscoProfile from "./views/stakeholder/DiscoProfile";
import Device from "./components/DeviceManagement/Device";


var routes =[
    {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: StakeholderDashboard,
    layout: "/stakeholder"
    },

     {
    path: "/subscriber-management",
    name: "Subscribers",
    icon: "tim-icons icon-single-02",
    component: Subscribers,
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
      layout: "/stakeholder"
  },
  {
      path: "/disco-admin-profile",
      name: "Disco Profile",
      icon: "tim-icons icon-single-02",
      component: DiscoProfile,
      layout: "/stakeholder",
      invisible: true
  },
  {
      path: "/device/:deviceID",
      name: "Device",
      component: Device,
      layout: "/stakeholder",
      invisible: true
  },

];


export default routes;

