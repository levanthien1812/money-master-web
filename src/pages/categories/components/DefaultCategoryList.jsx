import React from "react";
import DefaultCategoryItem from "./DefaultCategoryItem";

function DefaultCategoryList({ categories, onUpdateSuccess }) {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-2 gap-y-4 p-3">
      {categories &&
        categories.map((category) => (
          <DefaultCategoryItem
            category={category}
            key={category.id}
            onUpdateSuccess={onUpdateSuccess}
          />
        ))}
    </div>
  );
}

export default DefaultCategoryList;
