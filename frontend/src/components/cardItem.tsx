
import type { Book } from "../utilities/bookInterface"
import { ButtonPrimary } from "./ui/bottonFirt"
import { CreateCartItem } from "../hooks/createCartItemHook"
import { Link } from "react-router-dom"



interface CardItemInterface {
    Item : Book,

} 



export const CardItem = ({Item}: CardItemInterface) => {
    const { requestCreateCartItem } = CreateCartItem();

    return (
        <div className="group mx-auto flex h-full w-[82%] max-w-[22rem] flex-col overflow-hidden rounded-2xl border-2 border-[#3b332d] bg-[#141210] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#5a4e44] hover:shadow-xl">
            <div className="overflow-hidden border-b border-[#3b332d] bg-veloura-inverse/5">
                <img
                    src={Item.imageUrl}
                    alt="photo about the book that represent it better"
                    className="block h-96 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-1">
                    <h1 className="line-clamp-2 text-lg font-semibold text-veloura-accent">
                        {Item.title}
                    </h1>
                    <p className="text-sm text-veloura-inverse/70">
                        {Item.author}
                    </p>
                </div>
                <div className="mt-auto flex gap-3 pt-2">
                    <ButtonPrimary classname="flex-1 rounded-full bg-veloura-accent text-veloura-primary-hover shadow-sm transition-transform duration-200 hover:scale-[0.98]" onClick={() => requestCreateCartItem(Item.id)} type="button" label="Add to cart"></ButtonPrimary>
                    <Link
                        to={`/book/${Item.slug}`}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-veloura-primary-hover px-4 py-3 text-sm font-semibold text-veloura-surface-2 shadow-sm transition-transform duration-200 hover:scale-[0.98] hover:opacity-95"
                    >
                    Details
                    </Link>
                </div>
            </div>
        </div>

    )

}
