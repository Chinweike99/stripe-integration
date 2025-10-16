import { subscriptionService } from "@/services/subscription-service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useSubscriptionProducts = () => {
    return useQuery({
        queryKey: ['subscription-products'],
        queryFn: subscriptionService.getProducts
    })
}

export const useUserSubscriptions = () => {
    return useQuery({
        queryKey: ['user-subscriptions'],
        queryFn: subscriptionService.getUserSubscriptions
    })
}


export const useActiveSubscription =() => {
    return useQuery({
        queryKey: ['active-subscription'],
        queryFn: subscriptionService.getActiveSubscription
    })
};

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: subscriptionService.createSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user-subscriptions']});
            queryClient.invalidateQueries({queryKey: ['active-subscription']});
        }
    })
};


export const useCancelSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: subscriptionService.cancelSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user-subscriptions']});
            queryClient.invalidateQueries({queryKey: ['active-subscription']});
        }
    })
}



