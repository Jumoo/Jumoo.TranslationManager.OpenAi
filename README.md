# Jumoo.TranslationManager.OpenAi
Connector for Translation Manager using OpenAi

> This connector used the `Azure.AI.OpenAi` library so in theory we can also use the Azure OpenAi server (but at the moment we haven't wired up the endpoint code.

# OpenAi Translations in Umbraco ! 

Sounds cool right ? well it probibly is but there are a few things to be aware of if you are going to use the OpenAi translation connector:

## 1. We are not AI Tuning experts. 
We have provided some 'suggested' defaults for the variables and settings that are passed over to the OpenAI Api when items are translated - but we don't know if they are ideal, or if there are better options depending on your content. 

All we know is that we've build the connector in a way where you can change thses.

## 2. There is a cost to the OpenAI API.
These costs are not ours, beyond our control etc. and you will have to have an account with OpenAi and pay the bills ect. 


## 3. Its slower than Machine translation APIs
In testing we have seen the OpenAi translations take a lot longer then those from say Microsoft or Google Translation APIs. 

There is some Thottling in the Connector so you can avoid hitting Usage limits, depending on your plan you can probibly turn this down, but it will still be slow compared to other machine translations.

## 4. AI Generated translations are not always the same.
Again during testing it would appear that AI based translations are much more likely to change per request when compared to other machine based translations, which are much more consistant.

## 5. Translations might not actually be that good
Open AI translations come from the general AI model, and while this in theory 'knows it all' it is not a translation specific model. Some of the specific machine translation tools might produce better results. 


But, AI Translations !
