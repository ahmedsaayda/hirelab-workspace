import { useSelector } from "react-redux";
import { getPartner } from "../../redux/auth/selectors";

export function Logo(props) {
  const partner = useSelector(getPartner);
  return (
    <img
      height="40"
      style={{ height: 40 }}
      src={props.black ? "/logo-black.png" : partner?.logo}
      alt=""
    />
  );
}
