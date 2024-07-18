import { BigInt } from "@graphprotocol/graph-ts"
import { Deposit, Withdraw } from "../generated/VaultPackage/VaultPackage"
import { Account } from "../generated/schema"

export function handleDeposit(event: Deposit): void {
  let account = Account.load(event.params.owner.toHex())

  if (account == null) {
    account = new Account(event.params.owner.toHex())
    account.totalDeposits = BigInt.fromI32(0)
  }

  account.totalDeposits = account.totalDeposits.plus(event.params.assets)
  if (account.totalDeposits.gt(account.maxDeposits)) {
    account.maxDeposits = account.totalDeposits
  }

  account.save()
}

export function handleWithdraw(event: Withdraw): void {
  let account = Account.load(event.params.owner.toHex())

  if (account == null) {
    throw new Error('Null Account')
  }

  account.totalDeposits = account.totalDeposits.minus(event.params.assets)

  account.save()
}