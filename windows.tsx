import app from "ags/gtk4/app";
import { qs_page_set } from "./src/modules/quicksettings/quicksettings";
import { QuickSettingsWindow } from "./src/windows/quicksettings";
import { PowerMenuWindow, VerificationWindow } from "./src/windows/powermenu";
import { CalendarWindow } from "./src/windows/calendar";

export const windows_names = {
   quicksettings: "quicksettings",
   powermenu: "powermenu",
   verification: "verification",
   calendar: "calendar",
};

export function hideWindows() {
   app.get_windows().forEach((w) => {
      app.get_window(w.name)?.hide();
   });
   qs_page_set("main");
}

export function windows() {
   QuickSettingsWindow();
   PowerMenuWindow();
   VerificationWindow();
   CalendarWindow();
}
