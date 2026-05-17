<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>60.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>E-DOL Home Page</masterLabel>
    <targets>
        <target>lightningCommunity__Page</target>
        <target>lightningCommunity__Default</target>
        <target>lightning__AppPage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightningCommunity__Default">
            <property name="complaintsUrl" type="String" label="Complaint button URL" default="/forms" description="Target page used when the user clicks the Complaint button on the home page. Keep this property name because the published Experience Builder page already references it."/>
            <property name="trackUrl" type="String" label="Track complaint page URL" default="/forms/track-complaint"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
