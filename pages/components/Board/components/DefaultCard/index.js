import { Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function ProfileCard({
  children: card,
  dragging,
  allowRemoveCard,
  onCardRemove,
  onCardOptionClick,
}) {
  const renderAvatar = () => {
    //render avatar or initials (name or email)
    if (card.avatar) {
      return <Avatar size={32} src={card.avatar} />;
    }
    const name = card.fullname.trim() ? card.fullname : card.email;
    return (
      <span className="flex items-center justify-center h-full font-medium text-white bg-gray-500 rounded-full text-md aspect-square">
        {name[0]}
      </span>
    );
  };

  const renderAppliedAt = () => {
    // show number and unit units are s m h d w

    const now = new Date();
    const appliedAt = new Date(card.createdAt);
    const diff = now - appliedAt;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4);

    if (months > 0) return `${months}m`;
    if (weeks > 0) return `${weeks}w`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  return (
    <div
      onClick={() => {
        onCardOptionClick(card.id, "details-modal");
      }}
      className="p-4 mb-2 bg-white shadow-sm rounded-xl w-[220px] overflow-hidden cursor-pointer"
    >
      <div className="flex items-center gap-2 pr-4 mb-4 overflow-hidden">
        <div className="flex items-center justify-center w-8 h-8 rounded-full">
          {renderAvatar()}
        </div>
        <h2 className="mr-2 text-sm font-medium text-gray-900">
          {!!card.fullname.trim() ? card?.fullname : card.email}
        </h2>
      </div>
      <div className="flex items-center justify-between">
        <Rate
          value={card.stars ?? 0}
          onChange={(e) => onCardOptionClick(card.id, "stars-pick", { e })}
        />
        <span className="flex items-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="text-xs">{renderAppliedAt()}</span>
        </span>
      </div>
    </div>
  );
}
