import PageTitle from "@/components/Header/PageTitle";
import PageLayout from "@/components/Layout/PageLayout";
import BaseLayerConfigurator from "../components/BaseLayerConfigurator";

export const CreateMap = () => {
    return (
        <PageLayout>
            <PageTitle title={"Create a new Map"} />
            <BaseLayerConfigurator></BaseLayerConfigurator>
        </PageLayout>
    );
}