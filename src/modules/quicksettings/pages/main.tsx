import { Gtk } from "ags/gtk4";
import { QSSliders } from "../items/sliders";
import { MprisPlayers } from "../items/media";
import { QSButtons } from "../items/qsbuttons";
import { BatteryIcon, icons } from "@/src/lib/icons";
import AstalBattery from "gi://AstalBattery?version=0.1";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { bash, toggleWindow } from "@/src/lib/utils";
import { createBinding } from "ags";
import { createPoll } from "ags/time";
import { config, theme } from "@/options";
import { windows_names } from "@/windows";
import GLib from "gi://GLib";
const battery = AstalBattery.get_default();

function Power() {
   return (
      <button
         class={"qs-header-button"}
         tooltipText={"Power Menu"}
         focusOnClick={false}
         onClicked={() => toggleWindow(windows_names.powermenu)}
      >
         <image iconName={icons.powermenu.shutdown} pixelSize={20} />
      </button>
   );
}

function Battery() {
   return (
      <button
         cssClasses={["qs-header-button", "battery-button"]}
         visible={createBinding(battery, "isPresent")}
         focusOnClick={false}
      >
         <box spacing={theme.spacing}>
            <image iconName={BatteryIcon} pixelSize={24} />
            <label
               label={createBinding(battery, "percentage").as(
                  (p) => `${Math.floor(p * 100)}%`,
               )}
            />
         </box>
      </button>
   );
}

function DateTime() {
   const time = createPoll(
      "",
      1000,
      () => GLib.DateTime.new_now_local().format("%H:%M")!,
   );

   const date = createPoll(
      "",
      60000,
      () => GLib.DateTime.new_now_local().format("%a, %b %d")!,
   );

   return (
      <button
         cssClasses={["qs-header-button", "datetime"]}
         onClicked={() => toggleWindow(windows_names.calendar)}
         focusOnClick={false}
      >
         <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={4}
            valign={Gtk.Align.CENTER}
         >
            <label class={"time"} label={time} />
            <label class={"date"} label={date} />
         </box>
      </button>
   );
}

export function Header() {
   return (
      <box orientation={Gtk.Orientation.VERTICAL} spacing={theme.spacing}>
         <box spacing={theme.spacing} class={"header-top"}>
            <Battery />
            <box hexpand />
            <Power />
         </box>
         <box class={"header-center"} halign={Gtk.Align.CENTER}>
            <DateTime />
         </box>
      </box>
   );
}

function NotificationsBar() {
   const notifd = AstalNotifd.get_default();
   const notifications = createBinding(notifd, "notifications");
   const dnd = createBinding(notifd, "dontDisturb");

   return (
      <button
         class={"notifications-bar"}
         onClicked={() => notifd.set_dont_disturb(!notifd.dontDisturb)}
         focusOnClick={false}
      >
         <box spacing={theme.spacing} halign={Gtk.Align.CENTER}>
            <image
               iconName={dnd.as((d) => d ? icons.bell_off : icons.bell)}
               pixelSize={20}
            />
            <label
               label={notifications.as((n) =>
                  dnd.get()
                     ? "Do Not Disturb"
                     : n.length === 0
                        ? "No Notifications"
                        : `${n.length} Notification${n.length > 1 ? 's' : ''}`
               )}
            />
         </box>
      </button>
   );
}

export function MainPage() {
   return (
      <box
         $type={"named"}
         name={"main"}
         class={"qs-main-page"}
         orientation={Gtk.Orientation.VERTICAL}
         spacing={theme.spacing}
      >
         <Header />
         <QSButtons />
         <QSSliders />
         <NotificationsBar />
      </box>
   );
}
