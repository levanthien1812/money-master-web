import React from "react";
import UserCategoryItem from "./UserCategoryItem";

function UserCategoryList({ categories, onUpdateSuccess }) {
  return (
    <div className="py-3 mb-4">
      {categories &&
        categories.map((category) => (
          <UserCategoryItem
            key={Math.random()}
            category={category}
            onUpdateSuccess={onUpdateSuccess}
          />
        ))}
    </div>
  );
}

export default UserCategoryList;
