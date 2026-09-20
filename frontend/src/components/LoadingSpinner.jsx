import { Loader2 } from "lucide-react";


function LoadingSpinner({text = "Loading..."}) {

    return (

        <div className="flex items-center justify-center gap-3 py-6">

            <Loader2
                size={22}
                className="animate-spin text-[#D9A441]"
            />

            <span className="text-sm font-medium text-[#B8AC93]">
                {text}
            </span>

        </div>

    );
}


export default LoadingSpinner;