import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";

// White card with a 4px colored left border + matching icon. Variant
// colors are applied per-type via classNames.{success|error|warning|info}.
// Bare Sonner defaults provide the bg/shadow/animation; we only paint the
// border accent and pin the icon hue to match.
export function Toaster(props) {
  return (
    <SonnerToaster
      position="top-right"
      duration={4000}
      closeButton
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        error: <CircleAlert className="h-5 w-5 text-red-600" />,
        warning: <TriangleAlert className="h-5 w-5 text-amber-600" />,
        info: <Info className="h-5 w-5 text-blue-600" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!bg-white !text-gray-900 !border-l-4 !border-y !border-r !border-gray-200 !shadow-md !rounded-md",
          title: "!font-semibold !text-sm",
          description: "!text-xs !text-gray-600",
          closeButton: "!bg-white !text-gray-500 !border-gray-200",
          success: "!border-l-emerald-500",
          error: "!border-l-red-500",
          warning: "!border-l-amber-500",
          info: "!border-l-blue-500",
        },
      }}
      {...props}
    />
  );
}
