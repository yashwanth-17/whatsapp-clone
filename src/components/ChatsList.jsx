
export default function ChatsList({ setGroup,list,selectedGrpId }) {
  return (
    <div className="list">
      {list.length === 0 ? (
        <p className="text-center mt-3 text-secondary">No groups</p>
      ) : (
        list.map((item, i) => (
          <div
            key={i}
            className={"list-item " +(item.id===selectedGrpId?"active-item":"")}
            onClick={() => {
              setGroup(item);
            }}
          >
            <img
              className="avatar big"
              src={
                item.img
                  ? item.img
                  : "https://lh3.googleusercontent.com/ABlX4ekWIQimPjZ1HlsMLYXibPo2xiWnZ2iny1clXQm2IQTcU2RG0-4S1srWsBQmGAo=s300"
              }
              style={{ objectFit: "cover" }}
              alt="."
            />
            <div className="ml-1">
              <p className="title">{item.name}</p>
              <p className="subtitle">This is the last message.</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
