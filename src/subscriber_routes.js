
import SubscriberDashboard from "views/subscriber/Dashboard.js";
import Bills from "views/subscriber/Bills.js";
import MeterController from "views/subscriber/MeterController";
import Alerts from "views/subscriber/Alerts";
import Chats from "views/subscriber/Chats";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: SubscriberDashboard,
    layout: "/subscriber"
  },
  {
    path: "/meter-controller",
    name: "Meter Controller",
    icon: "tim-icons icon-button-power",
    component: MeterController,
    layout: "/subscriber"
  },
 {
    path: "/alerts",
    name: "Meter Alerts",
    icon: "tim-icons icon-time-alarm",
    component: Alerts,
    layout: "/subscriber"
  },  {
        path: "/bills",
        name: "Bills",
        icon: "tim-icons icon-money-coins",
        component: Bills,
        layout: "/subscriber"
  },
 {
    path: "/chats",
    name: "Messages",
    icon: "tim-icons icon-chat-33",
    component: Chats,
    layout: "/subscriber"
  },
];





export default routes;
