import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [freinds, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriends(friend) {
    setFriends((curFriends) => [...curFriends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(freind) {
    //setSelectedFriend(freind);
    setSelectedFriend((cur) => (cur?.id === freind.id ? null : freind));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    //console.log(value)
    setFriends((freinds) =>
      freinds.map((freind) =>
        freind.id === selectedFriend?.id
          ? { ...freind, balance: freind.balance + value }
          : freind
      )
    ); //here we are calculating and updating balance to current array

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          freinds={freinds}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriends={handleAddFriends} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplit={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ freinds, onSelection, selectedFriend }) {
  // const freinds = initialFriends;
  return (
    <ul>
      {freinds.map((freind) => (
        <Freind
          freind={freind}
          key={freind.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Freind({ freind, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === freind.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={freind.image} alt={freind.name} />
      <h3>{freind.name}</h3>
      {freind.balance < 0 && (
        <p className="red">
          You owe {freind.name} {Math.abs(freind.balance)}⟨₹⟩
        </p>
      )}
      {freind.balance > 0 && (
        <p className="green">
          {freind.name} owe you ⟨₹⟩{freind.balance}
        </p>
      )}
      {freind.balance === 0 && <p>You and {freind.name} are even ❤️</p>}
      <Button onClick={() => onSelection(freind)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id: crypto.randomUUID(),
    };
    onAddFriends(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏻‍🤝‍👩🏾Freind name :</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📸 Image URL :</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const paidByFriend = bill ? bill - myExpense : "";
  // const [friendExp, setFriendExp] = useState("");
  const [whoPaid, setWhoPaid] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !myExpense) return;
    onSplit(whoPaid === "user" ? paidByFriend : -myExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split the bill with {selectedFriend.name}</h2>

      <label>💰 Bill Value :</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>😌 Your expense :</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        } //-----------------validating expense to not more than hat of bill-------------------------
      />

      <label>👩🏻‍🤝‍👩🏾 {selectedFriend.name}'s expense :</label>
      <input type="text" value={paidByFriend} disabled />

      <label>🤑 Who is paying the bill?</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}
