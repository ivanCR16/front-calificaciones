import React from "react";
import { Link } from "react-router-dom";
import NavigationHistory from "./NavigationHistory";

export default function ItemsPage() {
    const items = ["item1", "item2", "item3"];

    const history = [
        { label: "Items", path: "/items" }
    ];

    return (
        <div style={{ padding: 20 }}>
            <NavigationHistory history={history} />

            <h2>Items</h2>
            <ul>
                {items.map(item => (
                    <li key={item}>
                        <Link to={`/items/${item}/products`}>{item}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
