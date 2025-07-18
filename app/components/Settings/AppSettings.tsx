import { registerDevice, signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";
import DoctorForm from "./DoctorForm";
import GeneralUserForm from "./UserForm";
import { Slider } from "@/components/ui/slider";
import { updateUser } from "@/db/users";
import _ from "lodash";
import { createClient } from "@/utils/supabase/client";
import React, { useCallback } from "react";
import { doesUserHaveADevice, updateDevice } from "@/db/devices";
import { useToast } from "@/components/ui/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
  } from "@/components/ui/tooltip";

interface AppSettingsProps {
    selectedUser: IUser;
    heading: React.ReactNode;
}

const AppSettings: React.FC<AppSettingsProps> = ({
    selectedUser,
    heading,
}) => {
    const supabase = createClient();
    const { toast } = useToast();
    const [isConnected, setIsConnected] = React.useState(false);
    const doctorFormRef = React.useRef<{ submitForm: () => void } | null>(null);
    const userFormRef = React.useRef<{ submitForm: () => void } | null>(null);
    const [deviceCode, setDeviceCode] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSave = () => {
        if (selectedUser.user_info.user_type === "doctor") {
            doctorFormRef.current?.submitForm();
        } else {
            userFormRef.current?.submitForm();
        }
    };

    const checkIfUserHasDevice = useCallback(async () => {
        setIsConnected(
            await doesUserHaveADevice(supabase, selectedUser.user_id)
        );
    }, [selectedUser.user_id, supabase]);

    const [volume, setVolume] = React.useState([
        selectedUser.device?.volume ?? 50,
    ]);

    const debouncedUpdateVolume = _.debounce(async () => {
        if (selectedUser.device?.device_id) {
            await updateDevice(
                supabase,
                { volume: volume[0] },
                selectedUser.device.device_id
            );
        }
    }, 1000); // Adjust the debounce delay as needed

    const updateVolume = (value: number[]) => {
        setVolume(value);
        debouncedUpdateVolume();
    };

    const onSave = async (values: any, userType: "doctor" | "user") => {
        console.log("onSave", values, userType);
       if (userType === "doctor") {
        await updateUser(
            supabase,
            {
                user_info: {
                    user_type: userType,
                    user_metadata: values,
                },
            },
            selectedUser!.user_id);
    } else {
        await updateUser(
            supabase,
            {
                supervisee_age: values.supervisee_age,
                supervisee_name: values.supervisee_name,
                supervisee_persona: values.supervisee_persona,
                user_info: {
                    user_type: userType,
                    user_metadata: values,
                },
            },
            selectedUser!.user_id);
    }
    toast({
        description: "Cài đặt của bạn đã được lưu!",
    });
}

    return (
        <>
            {selectedUser.user_info.user_type === "doctor" ? (
                <DoctorForm
                    selectedUser={selectedUser}
                    heading={heading}
                    onSave={onSave}
                    onClickCallback={() => handleSave()}
                />
            ) : (
                <GeneralUserForm
                    selectedUser={selectedUser}
                    heading={heading}
                    onSave={onSave}
                    onClickCallback={() => handleSave()}
                />
            )}
            <section className="space-y-4 max-w-screen-sm mt-12">
                <h2 className="text-lg font-semibold border-b border-gray-200 pb-2">
                    Cài đặt thiết bị
                </h2>
                <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-medium text-gray-700">
                            Đăng ký thiết bị của bạn
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-gray-200 text-gray-600 text-xs hover:bg-gray-300">
                              ?
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Đơn giản hóa, bạn có thể đăng ký địa chỉ MAC của Aisha của bạn ở đây. <br /> Tốt nhất là bạn muốn mã này là mã thân thiện cho thiết bị của bạn.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div
                            className={`rounded-full flex-shrink-0 h-2 w-2 ${
                                isConnected ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                        />

                        </div>

                        <div className="flex flex-row items-center gap-2 mt-2">
                            <Input
                                value={deviceCode}
                                disabled={isConnected}
                                onChange={(e) => setDeviceCode(e.target.value)}
                                placeholder={isConnected ? "**********" : "Nhập địa chỉ MAC của Aisha của bạn"}
                            />
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={isConnected}
                                onClick={async () => {
                                    const result = await registerDevice(selectedUser.user_id, deviceCode);
                                    if (result.error) {
                                        setError(result.error);
                                    }
                                    checkIfUserHasDevice();
                                }}
                            >
                                Đăng ký
                            </Button>
                        </div>
                        <p className="text-xs text-gray-400">
                            {isConnected ? <span className="font-medium text-gray-800">Đã đăng ký thành công!</span> :
                                error ? <span className="text-red-500">{error}.</span> :
                                "Thêm địa chỉ MAC của Aisha của bạn (ví dụ: 12:34:56:78:9A:BC) vào tài khoản của bạn để đăng ký nó."
                        }
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Đăng nhập với tư cách
                        </Label>
                        <Input
                            // autoFocus
                            disabled
                            value={selectedUser?.email}
                            className="max-w-screen-sm h-10 bg-white"
                            autoComplete="on"
                            style={{
                                fontSize: 16,
                            }}
                        />
                    </div>
                    {isConnected && <div className="flex flex-col gap-4 mt-6">
                        <Label className="text-sm font-medium text-gray-700">
                            Device volume
                        </Label>
                        <div className="flex flex-row gap-2 items-center flex-nowrap">
                            <Slider
                                value={volume}
                                onValueChange={updateVolume}
                                className="sm:w-1/2"
                                defaultValue={[50]}
                                max={100}
                                min={1}
                                step={1}
                            />
                            <p className="text-gray-500 text-sm">{volume}%</p>
                        </div>
                    </div>}
            <form
                            action={signOutAction}
                        className="flex flex-row justify-between mt-4"
                    >
                        <Button
                            variant="destructive"
                            size="sm"
                            className="font-medium flex flex-row items-center rounded-full gap-2 "
                        >
                            <LogOut size={18} strokeWidth={2} />
                            <span>Đăng xuất</span>
                            </Button>
                        </form>
                </div>
            </section>
        </>
    );
};

export default AppSettings;
