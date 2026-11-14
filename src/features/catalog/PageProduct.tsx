import { useParams } from "react-router";
import { Fragment } from "react";

export function Product() {
    const { id } = useParams<{ id: string}>()
    
    return (
        <Fragment>
            <h1>Pagina de producto con id {id}</h1>
        </Fragment>
    )
}
