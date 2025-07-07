import { useSelector } from "react-redux";
import { getPartner } from "../../redux/auth/selectors";

export function Logo(props) {
  const partner = useSelector(getPartner);
  return (
    <img
      height="72"
      style={{ height: 72 }}
      src={props.black ? "/Hirelab-Logo-purple-dashboard.png" : partner?.logo}
      alt=""
    />
  );
}
