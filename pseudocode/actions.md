## login

Ruolo :

Autenticare una sessione demo salvando nome, email  e loggedIn nello state.

Non salva password.


## logout

Ruolo : terminare la sessione demo dell'utente


```text
imposta state.session.loggedIn a false
svuota state.session.name
svuota state.session.email
salva lo stato con saveState
```

## requireMoney

Ruolo: validare un importo ricevuto in input e convertirlo in numero monetario.

```text
prendi value
prendi label

converti value in numero monetario usando toMoney

se amount non è maggiore di 0
  lancia errore : "{label} must be greater than zero"

ritorna amount
```

toMoney
  -> converte in numero monetario, se non valido torna 0

requireMoney
  -> pretende un numero positivo, se non valido lancia errore


## findById

Ruolo : trovare un elemento dentro una collezione usando il suo id.

Serve per azioni tipo:

deleteTransaction(id)
editBudget(id)
addMoneyToPot(id, amount)
withdrawFromPot(id, amount)
deletePot(id)



```text
prendi collection
prendi id
prendi label


cerca dentro collection un elemento con item.id uguale a id

se lo trovi
  ritorna l'elemento
altrimenti
  lancia errore "{label} not found"
```


## createTransaction

Ruolo : creare una nuova transazione e aggiornare il balance


```text
prendi name , category, date ,amount, type, recurring


valida name con requireText
valida category con requireText
valida amount con requireMoney


se type è "income"
  signedAmount = amount positivo
altrimenti
  signedAmount = amount negativo

crea transaction:
  id generato con generateId("transaction")
  avatar = DEFAULT_AVATAR
  name validato
  category validata
  date = date se presente, altrimenti data attuale ISO
  amount = signedAmount
  recurring = Boolean(recurring)


aggiungi transaction all'inizio di state.transactions


se signedAmount è positivo
  aumenta state.balance.current
  aumenta state.balance.income

altrimenti
  diminuisci state.balance.current
  aumenta state.balance.expenses usando valore assoluto

salva lo stato con saveState

ritorna transaction
```


createTransaction
  -> valida input
  -> crea oggetto transaction
  -> inserisce nello state
  -> aggiorna balance
  -> saveState
  -> ritorna transaction


## deleteTransaction

Ruolo : eliminare una transazione e annullare il suo effetto sul balance

```text

prendi id

trova transaction dentro state.transactions usando findById

rimuovi transaction da state.transactions

se transaction.amount è positivo:
  sottrai transaction.amount da balance.current
  sottrai transacation.amount da balance.income


se transaction.amount è negativo:
  sottrai transaction.amount da balance.current
    nota: sottrare un negativo aumenta current
  sottrai valore assoluto di balance.expenses

normalizza i valori monetario con toMoney

salva con state


ritorna transaction eliminata

```


## createBudget

Ruolo : creare un nuovo budget per una categoria e salvarlo nello state.


```text
prendi category, maximum, theme

valida category con requireText
valida maximum con requireMoney

controlla se esiste giù un budget con la stessa category

se esiste
  lancia errore "Budget already exists for this category

crea budget:
  id generato con generateId("budget")
  category validata
  maximum validato
  theme ricevuto oppure tema di default
aggiungi budget a state.budgets

salva lo stato con saveState
ritorna budget


```


createBudget
  -> valida input
  -> controlla unicità categoria
  -> crea budget
  -> modifica state.budgets
  -> saveState
  -> ritorna budget



  ## editBudget


  Ruolo : modificare un budget esistente


  Non cambia la categoria, perché la categoria identifica il budget nel modello mentale dell'app


  ```text
  prendi id
  prendi maximum e theme

  trova budget con findById

  valida maximum con requireMoney

  aggiorna budget.maximum

  se theme esiste
    aggiorna budget.theme
  altrimenti
    lascia theme precedente

  salva lo stato con saveState

  ritorna budget


  ```

## deleteBudget

```text
trova il budget con findById
rimuovi solo quel budget dallo state
salva lo stato
ritorna il budget eliminato
```

## createPot

```text
valida name come testo non vuoto e non oltre MAX_POT_NAME_LENGTH
valida target come importo positivo
rifiuta un nome già usato senza distinzione tra maiuscole e minuscole
crea il pot con total uguale a zero
aggiungi il pot allo state e salva
ritorna il pot
```

## editPot

```text
trova il pot con findById
valida name e target
rifiuta un nome duplicato escludendo il pot corrente
aggiorna name, target e theme opzionale
salva lo stato e ritorna il pot aggiornato
```

## addMoneyToPot

```text
trova il pot e valida un amount positivo
se amount supera il saldo disponibile lancia un errore
aumenta pot.total e diminuisci balance.current
salva lo stato e ritorna il pot
```

## withdrawFromPot

```text
trova il pot e valida un amount positivo
se amount supera pot.total lancia un errore
diminuisci pot.total e aumenta balance.current
salva lo stato e ritorna il pot
```

## deletePot

```text
trova il pot
rimuovilo dallo state
restituisci pot.total a balance.current
salva lo stato e ritorna il pot eliminato
```
