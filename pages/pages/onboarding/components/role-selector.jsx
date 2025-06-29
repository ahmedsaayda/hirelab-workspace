import React from "react";
import { User } from "lucide-react";
import cn from "classnames";



export function RoleSelector({
  selectedRole,
  onRoleSelect,
}) {
  const roles = [
    { id: "recruiter", label: "Recruiter" },
    { id: "manager", label: "Manager" },
    { id: "hr-manager", label: "HR Manager" },
  ];

  return (
    <div className="flex gap-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className={cn(
            "flex-1 cursor-pointer rounded-lg border border-dashed border-gray-200 py-4 text-center transition-colors hover:bg-gray-50",
            selectedRole === role.id &&
              "border-solid border-[#0066FF] bg-[#F5F8FF]"
          )}
          onClick={() => onRoleSelect(role.id)}
        >
          <User className="w-5 h-5 mx-auto" />
          <div className="mt-2 text-sm text-[#0066FF]">{role.label}</div>
        </div>
      ))}
    </div>
  );
}
