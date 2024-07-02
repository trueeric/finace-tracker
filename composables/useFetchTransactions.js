export const useFetchTransactions = (period) => {
	const supabase = useSupabaseClient()
	const transactions = ref([])
	const pending = ref(false)



	// * sum of type
	const income = computed(() => transactions.value.filter((t) => t.type === 'Income'))
	const expense = computed(() => transactions.value.filter((t) => t.type === 'Expense'))

	const incomeCount = computed(() => income.value.length)
	const expenseCount = computed(() => expense.value.length)

	const incomeTotal = computed(() => income.value.reduce((sum, transaction) => sum + transaction.amount, 0))
	const expenseTotal = computed(() => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0))

	// * fetchTransactions data
	const fetchTransactions = async () => {
		pending.value = true
		try {
      // the key must be unique for each period to avoid conflicts in the cache, so we use the period dates
			const { data } = await useAsyncData(`transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`, async () => {
				const { data, error } = await supabase
        .from('transactions')
        .select()
        .gte('created_at',period.value.from.toISOString()) //greater than
        .lte('created_at',period.value.to.toISOString()) //less than
        .order('created_at', { ascending: false })

				if (error) return []

				return data
			})

			return data.value
		} finally {
			pending.value = false
		}
	}

  const refresh = async () => (transactions.value = await fetchTransactions())

  // watch(period,async()=>await refresh())

  // ! avoid recursive calls:
  watch(period, async (previousValue, currentValue) => {
    if (
      previousValue.from.toISOString() === currentValue.from.toISOString() &&
      previousValue.to.toISOString() === currentValue.to.toISOString()
    ) {
      return;
    }

    await refresh();
  });

  const transactionsGroupedByDate = computed(() => {
    let grouped = {}
    for (const transaction of transactions.value) {
      // const date = new Date(transaction.created_at).toISOString()
      const date = new Date(transaction.created_at).toISOString().split('T')[0]

      if (!grouped[date]) {
        grouped[date] = []
      }

      grouped[date].push(transaction)
    }
    // sort at front end
    /*
    const sortedKeys = Object.keys(grouped).sort().reverse()
    const sortedGrouped = {}

    for (const key of sortedKeys) {
      sortedGrouped[key] = grouped[key]
    }

    return sortedGrouped
    */
    return grouped
  })

  return{
    transactions: {
      all:transactions,
      grouped:{
        byDate:transactionsGroupedByDate
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount
    },
    refresh,
    pending
  }
}
