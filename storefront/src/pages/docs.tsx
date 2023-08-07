import { RedocStandalone } from "redoc"

export default function Page() {
    return <RedocStandalone specUrl="http://localhost:7070/spec/SymetraHW-v1.0.json"></RedocStandalone>
}